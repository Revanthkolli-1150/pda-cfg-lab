import React, { useState, useEffect, useMemo } from 'react';
import { ArithmeticParser } from '../../core/parsers/ArithmeticParser.js';
import { ARITHMETIC_TEST_CASES } from '../../testcases/arithmeticTestCases.js';
import { ParseTreeVisualizer } from '../visualizers/ParseTreeVisualizer.jsx';
import { DerivationViewer } from '../visualizers/DerivationViewer.jsx';
import { TestCaseSelector } from '../common/TestCaseSelector.jsx';
import { GrammarCard } from '../common/GrammarCard.jsx';
import { Controls } from '../common/Controls.jsx';
import { StateDiagram } from '../visualizers/StateDiagram.jsx';
import { CheckCircle2, XCircle, Calculator, Info, Cpu, ArrowRight } from 'lucide-react';

export const ArithmeticLab = () => {
  const [input, setInput] = useState('id + id * id');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'derivations' | 'steps' | 'pda'

  // Parse result memoized
  const parseResult = useMemo(() => {
    const parser = new ArithmeticParser(input);
    return parser.parse();
  }, [input]);

  const steps = parseResult.steps || [];
  const currentStep = steps[currentStepIndex] || steps[steps.length - 1] || null;

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, speed);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

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
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleRunToComplete = () => {
    setCurrentStepIndex(Math.max(0, steps.length - 1));
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
                Case Study 1
              </span>
              <span className="text-xs text-slate-400 font-mono">Stratified Precedence CFG</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Arithmetic Expression Validation
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Validates expressions with identifiers, numeric literals, operators (+, -, *, /), and nested parentheses. Enforces operator precedence (* / over + -) and left-associativity.
            </p>
          </div>

          {/* Validation Status Pill */}
          <div
            className={`px-4 py-3 rounded-xl border flex items-center gap-3 self-start md:self-auto ${
              parseResult.success
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-rose-950/60 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/10'
            }`}
          >
            {parseResult.success ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="text-xs uppercase font-bold tracking-wider">
                {parseResult.success ? 'Accepted Expression' : 'Syntax Rejected'}
              </div>
              <div className="text-xs font-mono text-slate-300">
                {parseResult.success
                  ? 'Conforms to formal grammar'
                  : parseResult.errors[0] || 'Invalid syntax'}
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
                <Calculator className="w-4 h-4 text-cyan-400" />
                Expression Input Editor
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-normal">
                Supported: id, num, +, -, *, /, (, )
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
                placeholder="Enter expression e.g. id + id * id or (10 + 20) * 3"
                className="w-full bg-dark-950 border border-dark-700 rounded-lg px-4 py-3 font-mono text-base text-cyan-300 focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
              />
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="mt-4">
            <Controls
              currentStep={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onRunToComplete={handleRunToComplete}
              disabled={steps.length === 0}
            />
          </div>
        </div>

        {/* Test Case Selector */}
        <div className="lg:col-span-1">
          <TestCaseSelector
            testCases={ARITHMETIC_TEST_CASES}
            activeInput={input}
            onSelectCase={handleSelectCase}
          />
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-2">
        <button
          onClick={() => setActiveTab('tree')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeTab === 'tree'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          Parse Tree Visualization
        </button>
        <button
          onClick={() => setActiveTab('derivations')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeTab === 'derivations'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          Derivations (Leftmost &amp; Rightmost)
        </button>
        <button
          onClick={() => setActiveTab('steps')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeTab === 'steps'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          Step-by-Step Parse Log ({steps.length})
        </button>
        <button
          onClick={() => setActiveTab('pda')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all ${
            activeTab === 'pda'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          PDA Translation Model
        </button>
      </div>

      {/* Main Content Area based on active tab */}
      {activeTab === 'tree' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ParseTreeVisualizer
              tree={parseResult.tree}
              title={`Concrete Parse Tree: "${input}"`}
            />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <GrammarCard
              name="Arithmetic Precedence CFG"
              variables={['E', 'T', 'F']}
              terminals={['+', '-', '*', '/', '(', ')', 'id', 'num']}
              startSymbol="E"
              productions={[
                'E → E + T | E - T | T',
                'T → T * F | T / F | F',
                'F → ( E ) | id | num'
              ]}
              notes="Stratification ensures * and / bind tighter than + and -, while left-recursion enforces standard left-to-right evaluation."
            />
          </div>
        </div>
      )}

      {activeTab === 'derivations' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DerivationViewer
              leftmost={parseResult.leftmostDerivation}
              rightmost={parseResult.rightmostDerivation}
              title={`Derivations for "${input}"`}
            />
          </div>
          <div className="lg:col-span-1">
            <GrammarCard
              name="Derivation Rules Reference"
              variables={['E', 'T', 'F']}
              terminals={['+', '-', '*', '/', '(', ')', 'id', 'num']}
              startSymbol="E"
              productions={[
                'E → E + T | E - T | T',
                'T → T * F | T / F | F',
                'F → ( E ) | id | num'
              ]}
              notes="Notice how Leftmost expands the leftmost variable first at every step, whereas Rightmost expands the rightmost variable first."
            />
          </div>
        </div>
      )}

      {activeTab === 'steps' && (
        <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-dark-750 pb-3 mb-3">
            <h3 className="text-sm font-semibold text-slate-200">
              Recursive Descent Step-by-Step Execution Trace
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Active Step: <strong className="text-cyan-400">{currentStepIndex + 1}</strong> of {steps.length}
            </span>
          </div>

          <div className="max-h-[380px] overflow-auto border border-dark-800 rounded-lg">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="bg-dark-950 text-slate-400 border-b border-dark-800 sticky top-0">
                <tr>
                  <th className="py-2 px-3">Step</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Symbol</th>
                  <th className="py-2 px-3">Current Token</th>
                  <th className="py-2 px-3">Remaining Input</th>
                  <th className="py-2 px-3">Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800/60">
                {steps.map((st, i) => {
                  const isCurrent = i === currentStepIndex;
                  return (
                    <tr
                      key={st.step}
                      onClick={() => setCurrentStepIndex(i)}
                      className={`cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-cyan-950/70 text-white font-bold border-l-4 border-l-cyan-400'
                          : 'hover:bg-dark-850 text-slate-300'
                      }`}
                    >
                      <td className="py-2 px-3 text-cyan-400 font-bold">#{st.step}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-dark-800 border border-dark-700 text-slate-100">
                          {st.action}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-cyan-300">{st.symbol}</td>
                      <td className="py-2 px-3 text-amber-300">{st.currentToken}</td>
                      <td className="py-2 px-3 text-slate-400">{st.remainingTokens || '$'}</td>
                      <td className="py-2 px-3 text-slate-300">{st.detail}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pda' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StateDiagram
            title="Top-Down Predictive PDA Model for Arithmetic CFG"
            layoutType="arithmetic"
            currentState="q_parse"
          />

          <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">
                  Theoretical Translation: CFG to Pushdown Automaton
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Every Context-Free Grammar $G$ can be systematically translated into an equivalent Pushdown Automaton $M$ that accepts $L(G)$ by empty stack or final state.
              </p>

              <div className="bg-dark-950 p-3 rounded-lg border border-dark-800 text-xs font-mono space-y-2 mb-3">
                <div className="text-cyan-300 font-bold">1. Stack Initialization:</div>
                <div className="text-slate-400 pl-3">δ(q_init, ε, Z0) = (q_parse, EZ0)</div>

                <div className="text-cyan-300 font-bold">2. Non-terminal Expansion (Top-Down):</div>
                <div className="text-slate-400 pl-3">δ(q_parse, ε, E) ∋ (q_parse, E+T) | (q_parse, T)</div>
                <div className="text-slate-400 pl-3">δ(q_parse, ε, T) ∋ (q_parse, T*F) | (q_parse, F)</div>
                <div className="text-slate-400 pl-3">δ(q_parse, ε, F) ∋ (q_parse, (E)) | (q_parse, id)</div>

                <div className="text-cyan-300 font-bold">3. Terminal Matching (Consume Input):</div>
                <div className="text-slate-400 pl-3">δ(q_parse, a, a) = (q_parse, ε) for all a ∈ Σ</div>

                <div className="text-cyan-300 font-bold">4. Final Acceptance:</div>
                <div className="text-slate-400 pl-3">δ(q_parse, ε, Z0) = (q_acc, Z0)</div>
              </div>
            </div>

            <div className="p-3 bg-cyan-950/40 border border-cyan-800/50 rounded-lg text-xs text-cyan-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                In compilation practice, this is implemented deterministically using an $LL(k)$ predictive parsing table or an $LR(k)$ shift-reduce pushdown automaton.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
