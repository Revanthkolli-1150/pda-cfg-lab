# PDA & CFG LAB: Project Report
## Formal Languages and Automata (FLA) Assessment Task 3

---

## Executive Summary

**PDA & CFG LAB** is an interactive, professional compiler designer and automata laboratory developed for university **Formal Language and Automata (FLA) Assessment Task 3**.

The application moves beyond static educational presentations by providing fully functional, rigorous software implementations of:
1. **Context-Free Grammar (CFG) Parsing** via recursive descent with AST and parse-tree layout generation.
2. **Deterministic Pushdown Automata (DPDA)** execution with real-time stack and transition-table animation.
3. **Nondeterministic Pushdown Automata (NPDA)** execution with parallel configuration-tree exploration, midpoint guessing, and winning-path recovery.
4. **Ambiguity Analysis Workbench** demonstrating dual parse-tree generation for ambiguous grammars and formal precedence resolution.

The software is implemented in modern **React 18**, **Tailwind CSS**, and **JavaScript (ES Modules)**, bundled with **Vite**, and verified with an automated suite of **30 Vitest unit tests** covering all boundary conditions.

---

## Architecture Overview

```
src/
├── core/
│   ├── types.js                  # Token, TreeNode, DerivationStep definitions
│   ├── lexer.js                  # Modular lexer for Arithmetic, Parentheses, Palindromes
│   ├── cfg/
│   │   ├── Grammar.js            # Formal CFG 4-tuple G = (V, Σ, R, S)
│   │   ├── ParseTree.js          # Hierarchical layout coordinates computation
│   │   └── DerivationEngine.js   # Leftmost and Rightmost derivation generator
│   ├── parsers/
│   │   ├── ArithmeticParser.js   # Recursive descent precedence parser with trace log
│   │   ├── AmbiguityAnalyzer.js  # Dual parse-tree generator for id + id * id
│   │   ├── ParenthesesCFG.js     # Dyck language parser S → (S)S | ε
│   │   └── PalindromeCFG.js      # Palindrome CFG parser S → aSa | bSb | a | b | ε
│   └── automata/
│       ├── DPDAEngine.js         # General DPDA state-stack engine
│       ├── NPDAEngine.js         # BFS configuration-tree branching engine
│       ├── ParenthesesPDA.js     # Formal specification for balanced parentheses
│       └── PalindromeNPDA.js     # Formal specification for {w ∈ {a,b}* | w = w^R}
├── testcases/                    # >= 5 accepted and >= 5 rejected cases per study
├── components/                   # Interactive developer-grade UI & SVG Visualizers
└── tests/                        # 30 automated unit tests (Vitest)
```

---

## Case Study Summary Matrix

| Metric | Case Study 1: Arithmetic | Case Study 2: Parentheses | Case Study 3: Palindromes |
| :--- | :--- | :--- | :--- |
| **Formal Language** | Standard Infix Arithmetic | Dyck Language $D_1$ | Palindromes $\{w \in \{a,b\}^* \mid w = w^R\}$ |
| **Alphabet $\Sigma$** | $\{+, -, *, /, (, ), \text{id}, \text{num}\}$ | $\{(, )\}$ | $\{a, b\}$ |
| **Grammar Model** | Stratified CFG ($E, T, F$) | $S \to (S)S \mid \varepsilon$ | $S \to aSa \mid bSb \mid a \mid b \mid \varepsilon$ |
| **Automaton Model** | Top-Down Predictive PDA | 1-Stack DPDA | Nondeterministic NPDA |
| **Determinism Class** | Deterministic (DCFL) | Deterministic (DCFL) | Inherently Nondeterministic (CFL \ DCFL) |
| **Stack Alphabet $\Gamma$** | $\{Z_0, E, T, F, \dots\}$ | $\{Z_0, (\}$ | $\{Z_0, a, b\}$ |
| **Key Theoretical Feature** | Ambiguity resolution & precedence | LIFO matching & underflow detection | Nondeterministic midpoint guessing |

---

## Verification & Test Results

The engine was rigorously tested against boundary conditions, including empty strings ($\varepsilon$), nested parentheses, mismatched delimiters, odd and even palindromes, invalid characters, and operator clashes:

```bash
Test Files  5 passed (5)
     Tests  30 passed (30)
```

Every test case in the automated test suite is also accessible directly through the application UI with preset buttons and interactive execution traces.
