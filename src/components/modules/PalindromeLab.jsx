import React, { useState, useEffect, useMemo } from 'react';
import { PalindromeNPDA, PALINDROME_FORMAL_SPEC } from '../../core/automata/PalindromeNPDA.js';
import { PalindromeCFG } from '../../core/parsers/PalindromeCFG.js';
import { PALINDROME_TEST_CASES } from '../../testcases/palindromeTestCases.js';
import { StackVisualizer } from '../visualizers/StackVisualizer.jsx';
import { StateDiagram } from '../visualizers/StateDiagram.jsx';
import { TransitionTable } from '../visualizers/TransitionTable.jsx';
import { HistoryLog } from '../visualizers/HistoryLog.jsx';
import { BranchingTreeVisualizer } from '../visualizers/BranchingTreeVisualizer.jsx';
import { ParseTreeVisualizer } from '../visualizers/ParseTreeVisualizer.jsx';
import { DerivationViewer } from '../visualizers/DerivationViewer.jsx';
import { Controls } from '../common/Controls.jsx';
import { TestCaseSelector } from '../common/TestCaseSelector.jsx';
import { GrammarCard } from '../common/GrammarCard.jsx';
import { CheckCircle2, XCircle, GitBranch, Sparkles } from 'lucide-react';

export const PalindromeLab = () => {
  const [input, setInput] = useState('ababbaba');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'branching' | 'cfg'

  const npda = useMemo(() => new PalindromeNPDA(), []);

  // Run NPDA exploration
  const npdaResult = useMemo(() => {
    return npda.run(input);
  }, [npda, input]);

  // Run CFG parse
  const cfgResult = useMemo(() => {
    return PalindromeCFG.parse(input);
  }, [input]);

  const traceHistory = npdaResult.traceHistory || [];
  const currentHistoryStep = traceHistory[currentStepIndex] || traceHistory[traceHistory.length - 1] || null;

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying && currentStepIndex < traceHistory.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, speed);
    } else if (currentStepIndex >= traceHistory.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, traceHistory.length, speed]);

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
    if (currentStepIndex < traceHistory.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRunToComplete = () => {
    setCurrentStepIndex(Math.max(0, traceHistory.length - 1));
    setIsPlaying(false);
  };

  // Convert rules for TransitionTable component
  const transitionRules = useMemo(() => {
    return PALINDROME_FORMAL_SPEC.rules.map(r => ({
      id: r.id,
      from: r.from,
      input: r.input,
      stackTop: r.stackTop,
      to: r.to,
      stackAction: r.action,
      explanation: r.desc,
      formula: r.formula
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-dark-900 border border-dark-750/70 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase tracking-wider">
                Case Study 3
              </span>
              <span className="text-xs text-slate-400 font-mono">Nondeterministic PDA (NPDA)</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Palindrome Language Recognition
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Implements an NPDA for language L = {"{ w ∈ {a,b}* | w = w^R }"}. Because L is an inherently nondeterministic context-free language, the automaton nondeterministically guesses the midpoint (even or odd length) and verifies symmetric reflection.
            </p>
          </div>

          {/* Validation Status Pill */}
          <div
            className={`px-4 py-3 rounded-xl border flex items-center gap-3 self-start md:self-auto ${
              npdaResult.accepted
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/10'
            }`}
          >
            {npdaResult.accepted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="text-xs uppercase font-bold tracking-wider">
                {npdaResult.accepted ? 'Palindrome Accepted' : 'Rejected (Asymmetric)'}
              </div>
              <div className="text-xs font-mono text-slate-300">
                {npdaResult.accepted
                  ? `Winning branch found across ${npdaResult.configurationsExplored} configurations`
                  : `All ${npdaResult.totalBranches} explored branches died`}
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
                <GitBranch className="w-4 h-4 text-cyan-400" />
                Palindrome String Input
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-normal">
                Alphabet: Σ = &#123; 'a', 'b' &#125;
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
                placeholder="Enter string of a's and b's e.g. abba, aba, or ababbaba"
                className="w-full bg-dark-950 border border-dark-700 rounded-lg px-4 py-3 font-mono text-lg text-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner tracking-widest"
              />
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="mt-4">
            <Controls
              currentStep={currentStepIndex}
              totalSteps={traceHistory.length}
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onRunToComplete={handleRunToComplete}
              disabled={traceHistory.length === 0}
            />
          </div>
        </div>

        {/* Test Case Selector */}
        <div className="lg:col-span-1">
          <TestCaseSelector
            testCases={PALINDROME_TEST_CASES}
            activeInput={input}
            onSelectCase={handleSelectCase}
          />
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-2">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeTab === 'simulation'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          Winning Path Simulation (Stack &amp; States)
        </button>
        <button
          onClick={() => setActiveTab('branching')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeTab === 'branching'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          Nondeterministic Branch Tree ({npdaResult.totalBranches} paths)
        </button>
        <button
          onClick={() => setActiveTab('cfg')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeTab === 'cfg'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          CFG Grammar &amp; Derivations (S → aSa | bSb | ...)
        </button>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'simulation' && (
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
                title="NPDA State Transition Diagram"
                layoutType="palindrome"
                currentState={currentHistoryStep?.state || 'q0'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transition Table */}
            <TransitionTable
              transitions={transitionRules}
              activeRuleFormula={currentHistoryStep?.ruleDescription || ''}
              title="NPDA Formal Transition Rules"
            />

            {/* History Trace */}
            <HistoryLog
              history={traceHistory}
              currentStep={currentStepIndex}
              onSelectStep={(idx) => {
                setCurrentStepIndex(idx);
                setIsPlaying(false);
              }}
            />
          </div>
        </div>
      )}

      {activeTab === 'branching' && (
        <div className="space-y-6">
          <BranchingTreeVisualizer
            allConfigs={npdaResult.allConfigs}
            winningPath={npdaResult.winningPath}
            accepted={npdaResult.accepted}
          />
        </div>
      )}

      {activeTab === 'cfg' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ParseTreeVisualizer
              tree={cfgResult.tree}
              title={`Palindrome Parse Tree: "${input === '' ? 'ε' : input}"`}
            />
            <DerivationViewer
              leftmost={cfgResult.leftmostDerivation}
              rightmost={cfgResult.rightmostDerivation}
              title="Derivation Steps: S ⇒ aSa ⇒ ..."
            />
          </div>

          <div className="lg:col-span-1">
            <GrammarCard
              name="Palindrome Context-Free Grammar"
              variables={['S']}
              terminals={['a', 'b']}
              startSymbol="S"
              productions={[
                'S → a S a',
                'S → b S b',
                'S → a',
                'S → b',
                'S → ε'
              ]}
              notes="Notice that this language cannot be recognized by any Deterministic Pushdown Automaton (DPDA) because there is no delimiter separating w from w^R. An NPDA is strictly required to explore midpoint candidates nondeterministically."
            />
          </div>
        </div>
      )}
    </div>
  );
};
