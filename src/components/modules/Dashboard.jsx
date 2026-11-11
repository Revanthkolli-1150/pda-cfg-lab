import React from 'react';
import {
  Calculator,
  Code,
  GitBranch,
  Split,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  GraduationCap
} from 'lucide-react';

export const Dashboard = ({ onSelectModule }) => {
  const cards = [
    {
      id: 'arithmetic',
      title: 'Case Study 1: Arithmetic Expression Parser',
      badge: 'Stratified CFG',
      badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-800',
      description:
        'Validates arithmetic syntax with operator precedence (* / over + -), left-associativity, identifiers, and nested parentheses using a recursive descent CFG parser.',
      highlights: ['Recursive Descent', 'Leftmost & Rightmost Derivations', 'Precedence Trees', 'PDA Model'],
      icon: Calculator,
      color: 'cyan'
    },
    {
      id: 'parentheses',
      title: 'Case Study 2: Balanced Parentheses Checking',
      badge: 'Deterministic PDA',
      badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      description:
        'Simulates an actual Deterministic Pushdown Automaton (DPDA) over alphabet Σ = {(, )}. Pushes on opening delimiters, pops on closing, and detects underflow/overflow.',
      highlights: ['Animated Stack Operations', 'DPDA State Diagram', 'Transition Table', 'Dyck CFG'],
      icon: Code,
      color: 'emerald'
    },
    {
      id: 'palindrome',
      title: 'Case Study 3: Palindrome Recognition',
      badge: 'Nondeterministic PDA',
      badgeColor: 'bg-amber-950 text-amber-400 border-amber-800',
      description:
        'Executes a genuine Nondeterministic Pushdown Automaton (NPDA) for language L = {w ∈ {a,b}* | w = w^R}. Nondeterministically guesses midpoints and explores parallel branching configurations.',
      highlights: ['Midpoint Guessing', 'Configuration Tree Explorer', 'Odd & Even Symmetry', 'NPDA States'],
      icon: GitBranch,
      color: 'amber'
    },
    {
      id: 'theory',
      title: 'Educational Lab: Ambiguity & Determinism',
      badge: 'Automata Theory',
      badgeColor: 'bg-violet-950 text-violet-400 border-violet-800',
      description:
        'Interactive ambiguity lab with dual parse trees for id + id * id, precedence resolution, DFA vs DPDA vs NPDA comparative analysis, and Pumping Lemma proofs.',
      highlights: ['Dual Parse Trees', 'Precedence Resolution', 'DPDA ⊊ NPDA Proofs', 'Pumping Lemma'],
      icon: Split,
      color: 'violet'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-dark-900 via-dark-850 to-dark-900 border border-dark-750/70 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-violet-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/80 flex items-center gap-1.5 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5" />
              FLA Assessment Task 3
            </span>
            <span className="text-xs font-mono text-slate-400">Formal Languages &amp; Automata Theory</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            PDA &amp; CFG LAB
          </h1>
          <p className="text-lg font-medium text-cyan-400 mt-1">
            Interactive Context-Free Grammar and Pushdown Automata Simulator
          </p>

          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            A developer-grade laboratory for parsing, pushdown automata simulation, stack visualization, derivation generation, and ambiguity analysis. Built strictly adhering to automata theory and compiler construction principles.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-dark-950/80 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Case Studies</span>
              <span className="text-xl font-bold text-cyan-300">3 Interactive</span>
            </div>
            <div className="bg-dark-950/80 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Automata Engines</span>
              <span className="text-xl font-bold text-emerald-300">DPDA &amp; NPDA</span>
            </div>
            <div className="bg-dark-950/80 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Unit Tests</span>
              <span className="text-xl font-bold text-amber-300">30 Passing (Vitest)</span>
            </div>
            <div className="bg-dark-950/80 p-3 rounded-xl border border-dark-800">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Ambiguity Lab</span>
              <span className="text-xl font-bold text-violet-300">Dual Parse Trees</span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Cards Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-200 mb-4 tracking-wide uppercase font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Interactive Exploration Laboratories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map(card => {
            const IconComponent = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => onSelectModule(card.id)}
                className="bg-dark-900 border border-dark-750/70 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-cyan-500/10 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-dark-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-dark-950 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {card.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {card.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-dark-950 text-slate-300 text-[10px] font-mono border border-dark-800"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-dark-800 flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold group-hover:text-cyan-300">
                  <span>Open Interactive Lab</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
