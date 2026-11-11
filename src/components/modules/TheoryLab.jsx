import React, { useState } from 'react';
import { AmbiguityAnalyzer } from '../../core/parsers/AmbiguityAnalyzer.js';
import { ParseTreeVisualizer } from '../visualizers/ParseTreeVisualizer.jsx';
import { DerivationViewer } from '../visualizers/DerivationViewer.jsx';
import {
  Layers,
  GitBranch,
  Split,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  Binary,
  HelpCircle,
  Network
} from 'lucide-react';

export const TheoryLab = () => {
  const [activeTab, setActiveTab] = useState('ambiguity'); // 'ambiguity' | 'determinism' | 'pumping'

  // Generate dual parse trees for ambiguous grammar
  const { tree1, tree2 } = AmbiguityAnalyzer.generateAmbiguousTrees();
  const resolution = AmbiguityAnalyzer.getResolutionExplanation();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-dark-900 border border-dark-750/70 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-violet-950 text-violet-400 border border-violet-800 uppercase tracking-wider">
                Theory &amp; Formal Foundations
              </span>
              <span className="text-xs text-slate-400 font-mono">Chomsky Hierarchy &amp; Automata Theory</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Ambiguity, Determinism &amp; Computational Limits
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Formal language analysis demonstrating grammar ambiguity, dual parse tree generation, precedence stratification, the deterministic vs nondeterministic PDA boundary, and Pumping Lemma proofs.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-2">
        <button
          onClick={() => setActiveTab('ambiguity')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'ambiguity'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          <Split className="w-4 h-4" />
          <span>Grammar Ambiguity Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('determinism')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'determinism'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>DFA vs DPDA vs NPDA</span>
        </button>

        <button
          onClick={() => setActiveTab('pumping')}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'pumping'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-dark-850'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Pumping Lemma &amp; Stack Necessity</span>
        </button>
      </div>

      {/* Ambiguity Tab Content */}
      {activeTab === 'ambiguity' && (
        <div className="space-y-6">
          {/* Definition Alert */}
          <div className="bg-dark-900 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 shadow-lg">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <strong className="text-amber-300 text-sm block">Formal Definition of Grammar Ambiguity:</strong>
              <p>
                A Context-Free Grammar $G$ is called <em>ambiguous</em> if there exists at least one string $w \in L(G)$ that possesses two or more distinct parse trees, or equivalently, two or more distinct leftmost derivations.
              </p>
            </div>
          </div>

          {/* Grammar Comparison Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-900 border border-rose-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-dark-800">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  1. Ambiguous Grammar (Flawed)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  Non-stratified
                </span>
              </div>
              <div className="font-mono text-xs space-y-1 text-slate-200 bg-dark-950 p-2.5 rounded-lg border border-dark-800">
                <div>E → E + E</div>
                <div>E → E * E</div>
                <div>E → id</div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Allows operator + and * to compete symmetrically at the root level, producing two legal parse trees for <code className="text-cyan-300">id + id * id</code>.
              </p>
            </div>

            <div className="bg-dark-900 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-dark-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  2. Revised Unambiguous Grammar (Resolved)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Stratified Precedence
                </span>
              </div>
              <div className="font-mono text-xs space-y-1 text-slate-200 bg-dark-950 p-2.5 rounded-lg border border-dark-800">
                <div>E → E + T | E - T | T</div>
                <div>T → T * F | T / F | F</div>
                <div>F → ( E ) | id | num</div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Forces * and / into nonterminal T (deeper in parse tree), guaranteeing exactly one unique parse tree per valid expression.
              </p>
            </div>
          </div>

          {/* Dual Parse Trees Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tree 1 */}
            <div className="space-y-4">
              <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-cyan-300">
                    Parse Tree 1: Evaluating '+' First
                  </h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-300">
                    Semantics: (id + id) * id
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Associates addition tighter than multiplication. If id values are 2, 3, 4, evaluation yields: <strong className="text-white">(2 + 3) × 4 = 20</strong>.
                </p>
                <div className="min-h-[300px]">
                  <ParseTreeVisualizer tree={tree1.tree} title="Tree 1: (id + id) * id" />
                </div>
              </div>

              <DerivationViewer
                leftmost={tree1.derivation}
                title="Leftmost Derivation 1: Expanding E → E * E first"
              />
            </div>

            {/* Tree 2 */}
            <div className="space-y-4">
              <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-emerald-300">
                    Parse Tree 2: Evaluating '*' First (Standard)
                  </h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-slate-300">
                    Semantics: id + (id * id)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Matches conventional mathematical precedence. If id values are 2, 3, 4, evaluation yields: <strong className="text-white">2 + (3 × 4) = 14</strong>.
                </p>
                <div className="min-h-[300px]">
                  <ParseTreeVisualizer tree={tree2.tree} title="Tree 2: id + (id * id)" />
                </div>
              </div>

              <DerivationViewer
                leftmost={tree2.derivation}
                title="Leftmost Derivation 2: Expanding E → E + E first"
              />
            </div>
          </div>

          {/* Ambiguity Resolution Explanations */}
          <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              How Precedence Stratification Resolves Ambiguity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {resolution.explanation.map((item, idx) => {
                const parts = item.split(':');
                return (
                  <div key={idx} className="bg-dark-950 p-3 rounded-lg border border-dark-800">
                    <strong className="text-cyan-400 font-semibold block mb-1">
                      {parts[0]}
                    </strong>
                    <span className="text-slate-300 leading-relaxed">
                      {parts.slice(1).join(':')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Determinism vs Nondeterminism Tab */}
      {activeTab === 'determinism' && (
        <div className="space-y-6">
          {/* Comparison Matrix */}
          <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-white mb-3">
              Automata Classification &amp; Computational Power Comparison
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead className="bg-dark-950 text-slate-400 border-b border-dark-800">
                  <tr>
                    <th className="py-2.5 px-3">Automaton Model</th>
                    <th className="py-2.5 px-3">Memory Structure</th>
                    <th className="py-2.5 px-3">Branching Nature</th>
                    <th className="py-2.5 px-3">Language Family Accepted</th>
                    <th className="py-2.5 px-3">Determinism Equivalence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/60 text-slate-300">
                  <tr className="hover:bg-dark-850">
                    <td className="py-2.5 px-3 font-bold text-cyan-400">DFA (Deterministic Finite)</td>
                    <td className="py-2.5 px-3">Finite States Only (O(1) memory)</td>
                    <td className="py-2.5 px-3">Single path per input</td>
                    <td className="py-2.5 px-3 text-slate-200">Regular Languages (Chomsky Type 3)</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">DFA ≡ NFA (Equal power)</td>
                  </tr>
                  <tr className="hover:bg-dark-850">
                    <td className="py-2.5 px-3 font-bold text-violet-400">DPDA (Deterministic Pushdown)</td>
                    <td className="py-2.5 px-3">States + 1 Unbounded LIFO Stack</td>
                    <td className="py-2.5 px-3">At most one valid move per (q, a, X)</td>
                    <td className="py-2.5 px-3 text-slate-200">Deterministic Context-Free (DCFL)</td>
                    <td className="py-2.5 px-3 text-amber-400 font-bold">DPDA ⊊ NPDA (Strict Subset!)</td>
                  </tr>
                  <tr className="hover:bg-dark-850">
                    <td className="py-2.5 px-3 font-bold text-amber-400">NPDA (Nondeterministic Pushdown)</td>
                    <td className="py-2.5 px-3">States + 1 Unbounded LIFO Stack</td>
                    <td className="py-2.5 px-3">Multiple choices &amp; ε-transitions</td>
                    <td className="py-2.5 px-3 text-slate-200">All Context-Free Languages (Type 2)</td>
                    <td className="py-2.5 px-3 text-rose-400 font-bold">Strictly More Powerful than DPDA</td>
                  </tr>
                  <tr className="hover:bg-dark-850">
                    <td className="py-2.5 px-3 font-bold text-emerald-400">Turing Machine (TM)</td>
                    <td className="py-2.5 px-3">Unbounded 2-Way Infinite Tape</td>
                    <td className="py-2.5 px-3">Deterministic or Nondeterministic</td>
                    <td className="py-2.5 px-3 text-slate-200">Recursively Enumerable (Type 0)</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">DTM ≡ NTM (Equal power)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deep-Dive: Why Palindromes Require NPDA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-5 shadow-lg space-y-3">
              <h4 className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <Network className="w-4 h-4" />
                Case Study 2: Why Parentheses is a DCFL (Accepted by DPDA)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In balanced parentheses, every opening delimiter <code className="text-cyan-400 font-mono">(</code> and closing delimiter <code className="text-cyan-400 font-mono">)</code> explicitly declares the required action:
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc pl-5 font-mono">
                <li>Encountering '(' uniquely instructs: PUSH '('</li>
                <li>Encountering ')' uniquely instructs: POP '('</li>
              </ul>
              <p className="text-xs text-slate-300 leading-relaxed">
                There is never any ambiguity about which operation to perform. Consequently, a single deterministic path explores the input, making Balanced Parentheses a textbook <strong>Deterministic Context-Free Language (DCFL)</strong>.
              </p>
            </div>

            <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-5 shadow-lg space-y-3">
              <h4 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Case Study 3: Why Palindromes ww^R Inherently Require an NPDA
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Consider the language L = {"{ w w^R | w ∈ {a,b}* }"}. Unlike parentheses, there is <strong>no center marker</strong> (such as '$' or '#') signaling when the first half ends and the second half begins.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                For an input like <code className="text-amber-400 font-mono">aaaa</code>, the machine could guess the midpoint after 1 'a', 2 'a's, or 3 'a's. A DPDA cannot look ahead arbitrarily far; if it guesses prematurely it pops and dies; if it waits too long it cannot backtrack.
              </p>
              <div className="p-2.5 bg-amber-950/40 border border-amber-800/40 rounded-lg text-xs text-amber-200">
                <strong>Theorem:</strong> L = {"{ w w^R }"} is not a DCFL. It can only be recognized by a <strong>Nondeterministic Pushdown Automaton</strong> exploring midpoint branches concurrently.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pumping Lemma Tab Content */}
      {activeTab === 'pumping' && (
        <div className="bg-dark-900 border border-dark-750/70 rounded-xl p-6 shadow-lg space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white">
              Why Finite Automata (DFA/NFA) Cannot Recognize Unbounded CFLs
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Rigorous formal proof demonstrating why finite state machines fail on unbounded nested structures like parentheses and palindromes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                1. The Pigeonhole Principle
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Suppose a DFA $M$ has $p$ states ($|Q| = p$). When processing any input string $w$ of length $|w| \ge p$, the machine visits at least $p + 1$ states. By Dirichlet's Pigeonhole Principle, at least one state must be visited twice.
              </p>
            </div>

            <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-2">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase">
                2. The Pumping Decomposition
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every string $s \in L$ with $|s| \ge p$ can be divided into three parts $s = x y z$ such that:
              </p>
              <ul className="text-xs text-slate-400 list-disc pl-4 font-mono space-y-1">
                <li>$|y| \ge 1$ (non-empty loop)</li>
                <li>$|xy| \le p$ (loop within first $p$ chars)</li>
                <li>$x y^i z \in L$ for all $i \ge 0$</li>
              </ul>
            </div>

            <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 space-y-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                3. The Contradiction
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Choose string $s = (^p )^p \in L$. Since $|xy| \le p$, $y$ consists exclusively of opening parentheses $y = (^k$ ($k \ge 1$). Pumping $i = 2$ gives $s' = x y^2 z = (^{p + k} )^p$.
              </p>
              <p className="text-xs text-rose-300 font-bold">
                $p + k \neq p \implies s' \notin L$. Contradiction!
              </p>
            </div>
          </div>

          <div className="p-4 bg-dark-950 rounded-xl border border-dark-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white text-sm">Conclusion: The Architectural Role of the Stack</h4>
            <p>
              A finite automaton possesses only a fixed finite memory ($O(1)$) that cannot count an arbitrarily large number of opening parentheses or maintain an unbounded sequence of symbols to verify reverse reflection.
            </p>
            <p>
              A <strong>Pushdown Automaton (PDA)</strong> supplements the finite state control with an auxiliary <strong>unbounded Last-In, First-Out (LIFO) stack</strong>. This enables pushing an arbitrary count of symbols and later popping them in exact reverse chronological order, unlocking the full class of Context-Free Languages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
